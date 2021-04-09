<?php

namespace App\DataFixtures;

use App\Entity\Tag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TagFixtures extends Fixture implements FixtureGroupInterface
{
    public function load(ObjectManager $manager)
    {
        $important = new Tag();
        $important->setName('important');
        $important->setColor('#EE5044');

        $actionNeeded = new Tag();
        $actionNeeded->setName('action requise');
        $actionNeeded->setColor('#e6cc3c');

        $valid = new Tag();
        $valid->setName('validé');
        $valid->setColor('#65B872');

        $optional = new Tag();
        $optional->setName('facultatif');
        $optional->setColor('#1F5CD6');

        $manager->persist($important);
        $manager->persist($actionNeeded);
        $manager->persist($valid);
        $manager->persist($optional);

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['tagGroup'];
    }
}
