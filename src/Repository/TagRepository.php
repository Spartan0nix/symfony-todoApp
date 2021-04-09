<?php

namespace App\Repository;

use App\Entity\Tag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Tag|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tag|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tag[]    findAll()
 * @method Tag[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tag::class);
    }

    public function findTaskTags($taskId){
        // Get a connection to the database
        $conn = $this->getEntityManager()->getConnection();
        // SQL query
        $sql = 'SELECT tag.id,tag.color,tag.name
                FROM task_tag
                INNER JOIN tag ON task_tag.tag_id = tag.id
                WHERE task_tag.task_id = :taskId';

        // Prepare the query to be executed
        $tagsQuery = $conn->prepare($sql);
        // Execute the query and assign the variable a value
        $tagsQuery->execute(['taskId' => $taskId]);
        
        // Return an associative array
        $tags = $tagsQuery->fetchAllAssociative();

        return $tags;

    }
}
