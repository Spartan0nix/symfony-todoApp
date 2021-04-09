<?php

namespace App\DataFixtures;

use App\Entity\Task;
use App\Repository\TagRepository;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TaskFixtures extends Fixture implements FixtureGroupInterface
{   
    private $userRepository;
    private $tagRepository;

    public function __construct(UserRepository $userRepository, TagRepository $tagRepository)
    {
        $this->userRepository = $userRepository;
        $this->tagRepository = $tagRepository;

    }

    public function load(ObjectManager $manager)
    {   
        $faker = Factory::create('fr_FR');

        $importantTag = $this->tagRepository->find(25);
        $validateTag = $this->tagRepository->find(27);

        for ($userId=23; $userId < 34; $userId++) { 
            $user = $this->userRepository->find($userId);

            for($i = 0; $i < 8; $i++){
                $task = new Task();

                $task->setTitle($faker->sentence(4,true))
                        ->setDescription($faker->sentence(15,true))
                        ->setFinish(false)
                        ->setUserId($user);
                if($i === 0){
                    $task->addTagsId($importantTag);
                    $task->addTagsId($validateTag);
                }

                $manager->persist($task);
            }
        }
        
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['taskGroup'];
    }
}
