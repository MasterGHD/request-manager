<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\User;
use Faker\Factory;
use Faker\Generator as FakerGenerator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final readonly class UserFactory
{
    private FakerGenerator $fakerGenerator;

    public function __construct(
        private UserPasswordHasherInterface $userPasswordHasher,
    ) {
        $this->fakerGenerator = Factory::create();
    }

    /**
     * Create an array of User entities with random data.
     *
     * @param int $limit The number of users to create. Default is 10.
     * @return User[] an array of User entities
     */
    public function createUser(int $limit = 10): array
    {
        $users = [];

        for ($i = 0; $limit > 0 && $i < $limit; ++$i) {
            $user = new User();
            $user->setEmail($this->fakerGenerator->email())
                ->setName($this->fakerGenerator->name())
                ->setPassword($this->userPasswordHasher->hashPassword($user, 'password'))
                ->setRoles(['ROLE_USER'])
                ->setActive(1);
            $users[] = $user;
        }

        return $users;
    }

    public function createAdmin(): User
    {
        $user = $this->createUser(1)[0];
        $user->setEmail('admin@example.com')
            ->setRoles(['ROLE_ADMIN']);

        return $user;
    }
}
