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
        $currentDate = $day."-".$month."-".$year;
        $dayTasks = array();
        $searchTasks = array();

        $date = new DateTime($currentDate);

        $tasks = $this->taskRepository->findBy(['due_date' => $date]);
        foreach($tasks as $task){
            array_push($dayTasks, $this->taskNormalizer->normalizeTask($task));
        }
        
        $tasks = $this->taskRepository->findLimitTask($this->getUser()->getId(), 5);
        if($tasks){
            foreach($tasks as $task){
                array_push($searchTasks, $this->taskNormalizer->normalizeTask($task));
            }
        }
        
        return $this->render("calendar/day.html.twig", [
            'current_date' => $currentDate,
            'tasks' => $dayTasks,
            'userToken' => $this->getUser()->getApiToken(),
            'searchTasks' => $searchTasks
        ]);
    }

    /**
     * @Route("/calendar/task/add",name="calendar.task.add")
     * @return Response
     */
    public function addTask(Request $request){

        if($request->request){
            $taskId = $request->request->get('element');
            $currentDate = $request->request->get('currentDate');
            foreach($taskId as $id){
                $task = $this->taskRepository->find($id);
                $task->setDueDate(new DateTime($currentDate));
                $this->em->flush();
            }
        }
    
        return $this->redirectToRoute('calendar.index');
    }
}