<?php

namespace App\Controller\Calendar;

use App\Controller\Normalizer\TaskNormalizer;
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
     * @var TaskNormalizer
     */
    private $taskNormalizer;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(TaskRepository $taskRepository, EntityManagerInterface $em, TaskNormalizer $taskNormalizer)
    {
        $this->taskRepository = $taskRepository;
        $this->taskNormalizer = $taskNormalizer;
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
     * @Route("/calendrier/{day}-{month}-{year}/tasks", name="calendar.day.tasks")
     * @return Response
     */
    public function dayTask(String $day, String $month, String $year): Response {
        
        $date = new DateTime($day."-".$month."-".$year);
        $taskAsArray = array();

        $tasks = $this->taskRepository->findBy(['due_date' => $date]);
        foreach($tasks as $task){
            array_push($taskAsArray, $this->taskNormalizer->normalizeTask($task));
        }
        dump($taskAsArray);
        
        return $this->render("calendar/day.html.twig", [
            'tasks' => $taskAsArray,
            'userToken' => $this->getUser()->getApiToken()
        ]);
    }
}