<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AdminFixtures extends Fixture
{
    public function __construct(
        private readonly UserFactory $userFactory,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $user = $this->userFactory->createAdmin();
        $manager->persist($user);

        $manager->flush();
    }
}
