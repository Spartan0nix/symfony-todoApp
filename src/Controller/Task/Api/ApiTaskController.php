<?php

namespace App\Controller\Task\Api;

use App\Repository\TagRepository;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Controller\Normalizer\TagNormalizer;
use App\Controller\Normalizer\TaskNormalizer;

/**
 * @IsGranted("ROLE_USER")
 */
class ApiTaskController extends AbstractController
{
    /**
     * @var TaskRepository
     */
    private $TaskRepository;
    /**
     * @var TagRepository
     */
    private $TagRepository;
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var CsrfTokenManagerInterface
     */
    private $tokenProvider;
    /**
     * @var TagNormalizer
     */
    private $tagNormalizer;
    /**
     * @var TaskNormalizer
     */
    private $taskNormalizer;

    public function __construct(
        TaskRepository $TaskRepository,
        TagRepository $TagRepository, 
        EntityManagerInterface $em, 
        CsrfTokenManagerInterface $tokenProvider,
        TagNormalizer $tagNormalizer,
        TaskNormalizer $taskNormalizer
        )
    {
        // On initialise l'entityManager et le TaskRepository
        // Le TaskRepository permet d'intéragir avec la BDD comme un Model en architecture MVC
        // L'entityManager lui permet d'intéragir avec les entités (les faires persistés en BDD, portés les modifications en BDD, ...)
        $this->TaskRepository = $TaskRepository;
        $this->TagRepository = $TagRepository;
        $this->em = $em;
        $this->tokenProvider = $tokenProvider;
        $this->tagNormalizer = $tagNormalizer;
        $this->taskNormalizer = $taskNormalizer;
    }

    /*----------------------------------------------------------------------------------------------------*/
    /*          Get Task info                                                                             */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/task", name="api.task.info",methods="GET")
     * @return JsonResponse
     */
    public function apiGetTaskInfo(Request $request): JsonResponse {

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request) && $this->getUser()){
            $arrayTags = array();

            $id = $request->query->get("id");

            $token = $this->tokenProvider->refreshToken('update-token')->getValue();

            $task = $this->TaskRepository->findOneBy(['id' => $id]);
            $tags = $task->getTagsId();
            $userTags = $this->getUser()->getTags();

            $arrayTask = $this->taskNormalizer->normalizeTask($task);
            $arrayTask['tags'] = array();
 
            foreach($tags as $tag){
                array_push($arrayTask['tags'], $this->tagNormalizer->normalizeTag($tag));
            }
            foreach($userTags as $tag){
                array_push($arrayTags, $this->tagNormalizer->normalizeTag($tag));
            }

            if(!$task){
                return new JsonResponse($this->JsonTaskNotFound(), 404);
            }

            return new JsonResponse(array(
                'status' => 'success',
                'token' =>  $token,
                'task' => $arrayTask,
                'userTags' => $arrayTags
            ), 200);
        }    
    }

    /*----------------------------------------------------------------------------------------------------*/
    /*         Close Task request                                                                         */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/task/finish",name="api.task.finish",methods="POST")
     * @return JsonResponse
     */
    public function apiTaskFinish(Request $request): JsonResponse{

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){
            // $id = $request->request->get('TaskId');
            $body = $request->toArray();
            $id = $body['TaskId'];

            $task = $this->TaskRepository->find($id);

            if(!$task){
                return new JsonResponse($this->JsonTaskNotFound(), 404);
            }

            $task->setFinish(true);
            $this->em->flush();

            return new JsonResponse(array(
                'status' => 'success',
                'id' => $id,
                'message' => "Tâche validée avec succés."
            ), 200);
        }
    }

    /*----------------------------------------------------------------------------------------------------*/
    /*          reOpen Task request                                                                       */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/task/reopen",name="api.task.reopen",methods="POST")
     * @return JsonResponse
     */
    public function apiReOpenTask(Request $request): JsonResponse{

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){
            // $id = $request->request->get('TaskId');
            $body = $request->toArray();
            $id = $body['TaskId'];

            $task = $this->TaskRepository->find($id);

            if(!$task){
                return new JsonResponse($this->JsonTaskNotFound(), 404);
            }

            $task->setFinish(false);
            $this->em->flush();

            return new JsonResponse(array(
                'status' => 'success',
                'id' => $id,
                'message' => "Tâche rouverte avec succès."
            ), 200);
        }
    }
    
    /*----------------------------------------------------------------------------------------------------*/
    /*          Delete Task request                                                                       */
    /*----------------------------------------------------------------------------------------------------*/
    /** 
     * @Route("/api/task/delete", name="api.task.delete",methods="POST")
     * @return JsonResponse
    */
    public function apiDeleteTask(Request $request): JsonResponse {

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){

            $body = $request->toArray();
            $id = $body['TaskId'];

            $task = $this->TaskRepository->find($id);

            if(!$task){
                return new JsonResponse($this->JsonTaskNotFound(), 404);
            }

            $this->em->remove($task);
            $this->em->flush();

            return new JsonResponse(array(
                'status' => 'success',
                'id' => $id,
                'message' => "Tâche supprimée avec succés."
            ), 200);
        }
    }
    
    /*----------------------------------------------------------------------------------------------------*/
    /*          Update Task request                                                                       */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/task/update", name="api.task.update",methods="POST")
     * @return JsonResponse
     */
    public function apiUpdateTask(Request $request): JsonResponse {

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){

            $body = $request->toArray();

            $id = $body['id'];
            $title = $body['title'];
            $description = $body['description'];
            $token = $body['token'];
            $addTagArray = $body['addTags'];
            $removeTagArray = $body['removeTag'];

            $task = $this->TaskRepository->find($id);

            if(!$task){
                return new JsonResponse($this->JsonTaskNotFound(), 404);
            }   

            if(!$this->isCsrfTokenValid('update-token', $token)){
                return new JsonResponse($this->invalidCsrfToken(), 401);
            }
            
            $task->setTitle($title);
            $task->setDescription($description);

            foreach($removeTagArray as $tagId){
                $currentTag = $this->TagRepository->find($tagId);
                if($task->getTagsId($currentTag)){
                    $task->removeTagsId($currentTag);
                }
            }
            foreach($addTagArray as $tagId){
                $currentTag = $this->TagRepository->find($tagId);
                $task->addTagsId($currentTag);
            }

            $this->em->flush();

            $updatedTags = array();
            foreach($task->getTagsId() as $tag){
                array_push($updatedTags, $this->tagNormalizer->normalizeTag($tag));
            }

            return new JsonResponse(array(
                'status' => 'success',
                'task' => $this->taskNormalizer->normalizeTask($task),
                'tags' => $updatedTags,
                'message' => "Tâche modifié avec succés.",
            ), 200);
        }
    }

    /*----------------------------------------------------------------------------------------------------*/
    /*          ReOrder Task request                                                                       */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/task/reorder", name="api.task.reorder",methods="POST")
     * @return JsonResponse
     */
    public function apiReOrderTask(Request $request): JsonResponse {

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){

            $orderArray = $request->toArray();
            
            $array = array_values($orderArray)[0];
            foreach($array as $position => $id){
                $this->TaskRepository->updateOrder($id, $position);
            }
            $this->em->flush();
            
            return new JsonResponse(array(
                'status' => 'success',
                'message' => "Ordre enregistré avec succès",
            ), 200);
        }
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

    public function invalidCsrfToken(){
        return array(
            'status' => 'error',
            'message' => "Jeton invalide."
        );
    }
    /*----------------------------------------------------------------------------------------------------*/
}