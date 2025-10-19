<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use function filter_var;
use function implode;
use function sprintf;
use function strlen;

use const FILTER_VALIDATE_EMAIL;

#[AsCommand(
    name: 'app:create-user',
    description: 'Creates a new user account',
)]
final class CreateUserCommand
{
    public function __construct(private readonly EntityManagerInterface $entityManager, private readonly UserPasswordHasherInterface $userPasswordHasher)
    {
    }

    public function __invoke(SymfonyStyle $symfonyStyle): int
    {
        $symfonyStyle->title('Create New User');
        // Ask for email with validation
        $email = $symfonyStyle->ask('Email', null, function (?string $value): string {
            if (in_array($value, [null, '', '0'], true)) {
                throw new RuntimeException('Email cannot be empty.');
            }

            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new RuntimeException('Invalid email format.');
            }

            return $value;
        });
        // Check if user already exists
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser !== null) {
            $symfonyStyle->error(sprintf('A user with email "%s" already exists.', $email));

            return Command::FAILURE;
        }
        // Ask for name with validation
        $name = $symfonyStyle->ask('Full Name', null, function (?string $value): string {
            if (in_array($value, [null, '', '0'], true)) {
                throw new RuntimeException('Name cannot be empty.');
            }

            if (strlen($value) < 2) {
                throw new RuntimeException('Name must be at least 2 characters long.');
            }

            return $value;
        });
        // Ask for password with validation
        $passwordQuestion = new Question('Password (min 8 characters)');
        $passwordQuestion->setHidden(true);
        $passwordQuestion->setValidator(function (?string $value): string {
            if (in_array($value, [null, '', '0'], true)) {
                throw new RuntimeException('Password cannot be empty.');
            }

            if (strlen($value) < 8) {
                throw new RuntimeException('Password must be at least 8 characters long.');
            }

            return $value;
        });
        $password = $symfonyStyle->askQuestion($passwordQuestion);
        // Ask if user should be admin
        $isAdmin = $symfonyStyle->confirm('Grant admin privileges?', false);
        // Create user
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $password));
        $user->setActive(1);
        $roles = ['ROLE_USER'];
        if ($isAdmin) {
            $roles[] = 'ROLE_ADMIN';
        }
        
        $user->setRoles($roles);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        $symfonyStyle->success(sprintf(
            'User "%s" (%s) created successfully with role(s): %s',
            $name,
            $email,
            implode(', ', $roles),
        ));
        return Command::SUCCESS;
    }
}
