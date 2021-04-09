<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Faker\Factory;

class UserFixtures extends Fixture implements FixtureGroupInterface
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        $userTest = new User();

        $userTest->setEmail('test@humblole.com');
        $userTest->setPassword($this->passwordEncoder->encodePassword($userTest, 'password'));
        $userTest->setRoles(array('ROLE_ADMIN'));
        
        $manager->persist($userTest);

        for($i = 0; $i < 10; $i++){
            $user = new User();

            $user->setEmail($faker->email);
            $user->setPassword($this->passwordEncoder->encodePassword($user, 'password'));

            $manager->persist($user);
        }

        
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['userGroup'];
    }
}
