<?php

namespace App\Controller\Normalizer;

class TaskNormalizer
{
    public function normalizeTask($task){

        $normalizeArray = array(
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'description' => $task->getDescription(),
            'finish' => $task->getFinish(),
            'created_at' => $task->getCreatedAt(),
            'due_date' => ($task->getDueDate()) ? $task->getDueDate()->format('d-m-Y') : "",
            'position' => $task->getPosition(),
            "tags" => array()
        );

        foreach($task->getTagsId() as $tag){
            array_push($normalizeArray['tags'], array(
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'color' => $tag->getColor()
            ));
        }

        return $normalizeArray;
    }
}