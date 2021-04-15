<?php

namespace App\Controller\Calendar\Api;

use App\Controller\Normalizer\TaskNormalizer;
use App\Repository\TaskRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ApiCalendarController extends AbstractController
{
    /**
     * @var TaskRepository
     */
    private $taskRepository;
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var TaskNormalizer
     */
    private $taskNormalizer;

    public function __construct(TaskRepository $taskRepository, EntityManagerInterface $em, TaskNormalizer $taskNormalizer)
    {
        $this->taskRepository = $taskRepository;
        $this->em = $em;
        $this->taskNormalizer = $taskNormalizer;
    }

    /**
     * @Route("/api/calendar/tasks",name="calendar.tasks",methods="GET")
     * @return JsonResponse
     */
    public function getUserTask(Request $request): JsonResponse {

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(!$request->headers->has('X-Auth-Token')) {
            return new JsonResponse(array(
                'status' => 'error',
                'message' => 'jeton invalide'
            ), 401);
        }

        $month = $request->query->get("month");

        $tasks = $this->taskRepository->findDueTask($month, $this->getUser()->getId());

        return new JsonResponse(array(
            'status' => 'success',
            'tasks' =>  $tasks
        ), 200);
    }

    /**
     * @Route("/api/calendar/search", name="calendar.search", methods="GET")
     * @return JsonResponse
     */
    public function searchTask(Request $request): JsonResponse{

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(!$request->headers->has('X-Auth-Token')) {
            return new JsonResponse(array(
                'status' => 'error',
                'message' => 'jeton invalide'
            ), 401);
        }

        $searchString = $request->query->get("string");
        $normalizeTasks = array();

        $tasks = $this->taskRepository->searchTask($this->getUser()->getId(), $searchString);

        if(!$tasks){
            return new JsonResponse(array(
                'status' => 'success',
                'message' =>  'Aucune tâche trouvée ...'
            ), 404);
        }

        foreach($tasks as $task){
            array_push($normalizeTasks, $this->taskNormalizer->normalizeTask($task));
        }

        return new JsonResponse(array(
            'status' => 'success',
            'tasks' =>  $normalizeTasks
        ), 200);
    }

    /*----------------------------------------------------------------------------------------------------*/
    public function isNotXmlHttpRequest(){
        return array(
            "status" => "error",
            "message" => "Erreur lors de la requête (Format non supporté)."
        );
    }
    
    public function JsonTaskNotFound(){
        return array(
            "status" => "error",
            "message" => "La tâche sélectionnée n'a pas été trouvée."
        );
    }
    /*----------------------------------------------------------------------------------------------------*/
}