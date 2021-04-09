<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Task|null find($id, $lockMode = null, $lockVersion = null)
 * @method Task|null findOneBy(array $criteria, array $orderBy = null)
 * @method Task[]    findAll()
 * @method Task[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * Use for the homepage
     * Get all the tasks and tags in the database
     * Associate each tags with the corresponding task
     * @return array
     */
    public function findAllTask(){
        // Get a connection to the database
        $conn = $this->getEntityManager()->getConnection();
        // SQL request to get all tasks info
        $tasksSql = 'SELECT task.id, task.title, task.description, task.finish, task.created_at, task.position 
                    FROM task
                    ORDER BY task.position';
        // SQL request to get all tags info
        $tagsSql = 'SELECT tag.id, tag.name, tag.color, task_id, task.position
                    FROM tag
                    INNER JOIN task_tag ON tag.id = tag_id
                    INNER JOIN task ON task_id = task.id
                    ORDER BY task.position;';
        // Execute queries
        $tasksQuery = $conn->prepare($tasksSql);
        $tasksQuery->execute();
        $TagsQuery = $conn->prepare($tagsSql);
        $TagsQuery->execute();
        // Return the results as an associative array
        $tasks = $tasksQuery->fetchAllAssociative();
        $tags = $TagsQuery->fetchAllAssociative();

        // Keep track of the current Task index
        $taskPosition = 0;
        // Loop through the different tasks
        foreach($tasks as $task){
            // Need to create a new index in the array to store the task tags
            $tasks[$taskPosition]['tags'] = array();
            // Loop through the different tags
            foreach($tags as $tag) { 
                // If the current taskId === the current tagId, push the current tag to the task 'tags' array
                if($task['id'] === $tag['task_id']){
                    array_push($tasks[$taskPosition]['tags'], $tag);
                    // unset($tags[$tagPosition]);
                }
                // $tagPosition++;
            }
            $taskPosition++;
        }
        return $tasks;
    }

    /**
     * Update the current task position [$id => TaskId, position => TaskPosition]
     * @param int $id
     * @param int $position
     * @return void
     */
    public function updateOrder($id, $position){
        return $this->_em->createQueryBuilder()
            ->update('App\Entity\Task', 't')
            ->set('t.position', ':position')
            ->where('t.id = :id')
            ->setParameters(['position' => $position, 'id' => $id])
            ->getQuery()
            ->execute()
        ;
    }

    public function findData($id){
        return $this->createQueryBuilder('task')
            ->leftJoin('task.tags_id', 'tag')
            ->addSelect('tag')
            ->where('task.user_id = :userId')
            ->setParameters(['userId' => $id])
            ->orderBy('task.position')
            ->getQuery()
            ->execute()
        ;
    }
}
