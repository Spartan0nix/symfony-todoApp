<?php

namespace App\Controller\Task;

use App\Entity\Tag;
use App\Entity\Task;
use App\Entity\User;
use App\Form\TaskType;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @IsGranted("ROLE_USER")
 */
class TaskController extends AbstractController
{
    /**
     * @var TaskRepository
     */
    private $TaskRepository;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(TaskRepository $TaskRepository, EntityManagerInterface $em)
    {
        // On initialise l'entityManager et le TaskRepository
        // Le TaskRepository permet d'intéragir avec la BDD comme un Model en architecture MVC
        // L'entityManager lui permet d'intéragir avec les entités (les faires persistés en BDD, portés les modifications en BDD, ...)
        $this->TaskRepository = $TaskRepository;
        $this->em = $em;
    }

    /**
     * @Route("/task",name="task.index")
     * @return Response
     */
    public function index(Request $request): Response{

        // Get current User Id
        $userId = $this->getUser()->getId();
        // Get user Tasks and corresponding tags form the database
        $EntityTasks = $this->TaskRepository->findData($userId);
        $taskAsArray = [];

        // $tag = $this->getDoctrine()->getRepository(Tag::class)->find(26);
        // $usertask = $this->TaskRepository->find(77);
        // $usertask->addTagsId($tag);
        // $this->em->flush();

        /**
         * Return an array instead of an Entity
         * Also remove user password field
         */
        $i = 0;
        foreach($EntityTasks as $task){
            $taskAsArray[$i] = array(
                "id" => $task->getId(),
                "title" => $task->getTitle(),
                "description" => $task->getDescription(),
                "finish" => $task->getFinish(),
                "created_at" => $task->getCreatedAt(),
                "position" => $task->getPosition(),
                "tags" => $task->getTagsId()->unwrap()
            );
            $i++;
        }
        
        $user = array(
            "id" => $this->getUser()->getId(),
            "email" => $this->getUser()->getEmail(),
            "roles" => $this->getUser()->getRoles(),
            "token" => $this->getUser()->getApiToken()
        );

        $task = new Task();

        $CreateTaskform = $this->createForm(TaskType::class, $task);
        $CreateTaskform->handleRequest($request);

        if($CreateTaskform->isSubmitted() && $CreateTaskform->isValid()){

            $userId = $this->getUser();

            $task = $CreateTaskform->getData();
            $task->setUserId($userId);

            $this->em->persist($task);
            $this->em->flush();

            $this->addFlash('success','Tâche ajoutée avec succès.');
            return $this->redirectToRoute('task.index');

        }elseif($CreateTaskform->isSubmitted() && !$CreateTaskform->isValid()){
            $this->addFlash("error","La tâche n'a pas pu être ajoutée");
        }

        // On render notre vue et fais passer notre objet Tasks 
        return $this->render('table/index.html.twig', [
            'tasks' => $taskAsArray,
            'user' => $user,
            'Createform' => $CreateTaskform->createView()
        ]);
    }
    
    /*----------------------------------------------------------------------------------------------------*/
    public function taskNotFound(){
        $this->addFlash("error","La tâche sélectionnée n'a pas été trouvée.");
        return $this->redirectToRoute('task.index');
    }
    /*----------------------------------------------------------------------------------------------------*/
}