<?php

namespace App\Controller\Calendar;

use App\Repository\TaskRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Date;

class CalendarController extends AbstractController
{
    /**
     * @var TaskRepository
     */
    private $taskRepository;

    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(TaskRepository $taskRepository, EntityManagerInterface $em)
    {
        $this->taskRepository = $taskRepository;
        $this->em = $em;
    }
    /**
     * @Route("/calendrier",name="calendar.index")
     * @return Response
     */
    public function index(Request $request): Response {


        return $this->render("calendar/index.html.twig", [
            'token' => $this->getUser()->getApiToken()
        ]);
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
}