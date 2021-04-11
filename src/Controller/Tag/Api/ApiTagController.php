<?php

namespace App\Controller\Tag\Api;

use App\Controller\Normalizer\TagNormalizer;
use App\Controller\Normalizer\TaskNormalizer;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class ApiTagController extends AbstractController
{
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

    public function __construct(
        TagRepository $TagRepository, 
        EntityManagerInterface $em, 
        CsrfTokenManagerInterface $tokenProvider,
        TagNormalizer $tagNormalizer)
    {
        $this->TagRepository = $TagRepository;
        $this->em = $em;
        $this->tokenProvider = $tokenProvider;
        $this->tagNormalizer = $tagNormalizer;
    }

    /*----------------------------------------------------------------------------------------------------*/
    /*          Get all Tags                                                                              */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/tag/index", name="api.tag.index",methods="GET")
     * @return JsonResponse
     */
    public function apiGetTag(Request $request): JsonResponse {

        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){

            $tags = $this->TagRepository->findAll();
            $arrayTags = array();

            foreach($tags as $tag){
                array_push($arrayTags, $this->tagNormalizer->normalizeTag($tag));
            }

            if(!$tags){
                return new JsonResponse($this->JsonTagNotFound(), 404);
            }

            return new JsonResponse(array(
                'status' => 'success',
                'tags' => $arrayTags
            ), 200);
        }    
    }

    /*----------------------------------------------------------------------------------------------------*/
    /*          Get single tag info                                                                       */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/tag", name="api.tag.info", methods="GET")
     * @return JsonResponse
     */
    public function getTagInfo(Request $request): JsonResponse {
        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){
            $id = $request->query->get('id');
            $token = $this->tokenProvider->refreshToken('modal-token')->getValue();

            $tag = $this->TagRepository->findOneBy(['id' => $id]);

            if(!$tag){
                return new JsonResponse($this->JsonTagNotFound(), 404);
            }

            return new JsonResponse(array(
                'status' => 'success',
                'tag' => $this->tagNormalizer->normalizeTag($tag),
                'token' => $token
            ), 200);
        }
    }
    /*----------------------------------------------------------------------------------------------------*/
    /*          Remove Tag                                                                                */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/tag/delete", name="api.tag.delete",methods="POST")
     * @return JsonResponse
     */
    public function apiDeleteTag(Request $request): JsonResponse {
        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){
            $body = $request->toArray();
            $id = $body['tagId'];

            $tag = $this->TagRepository->find($id);

            if(!$tag){
                return new JsonResponse($this->JsonTagNotFound(), 404);
            }

            $this->em->remove($tag);
            $this->em->flush();

            return new JsonResponse(array(
                'status' => 'success',
                'id' => $id,
                'message' => "Tag supprimée avec succés."
            ), 200);
        }
    }
    /*----------------------------------------------------------------------------------------------------*/
    /*          Update Tag                                                                                */
    /*----------------------------------------------------------------------------------------------------*/
    /**
     * @Route("/api/tag/update", name="api.tag.update",methods="POST")
     * @return JsonResponse
     */
    public function apiUpdateTag(Request $request): JsonResponse {
        if(!$request->isXmlHttpRequest()){
            return new JsonResponse($this->isNotXmlHttpRequest(), 400);
        }

        if(isset($request->request)){
            $body = $request->toArray();
            $id = $body['id'];
            $name = $body['name'];
            $color = $body['color'];
            $token = $body['token'];

            if(!$this->isCsrfTokenValid('modal-token', $token)){
                return new JsonResponse($this->invalidCsrfToken(), 401);
            }

            $tag = $this->TagRepository->find($id);

            if(!$tag){
                return new JsonResponse($this->JsonTagNotFound(), 404);
            }

            $tag->setName($name);
            $tag->setColor($color);
            $this->em->flush();

            return new JsonResponse(array(
                'status' => 'success',
                'tag' => $this->tagNormalizer->normalizeTag($tag),
                'message' => "Tag mise à jour avec succés."
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
    
    public function JsonTagNotFound(){
        return array(
            "status" => "error",
            "message" => "Le tag sélectionnée n'a pas été trouvée."
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