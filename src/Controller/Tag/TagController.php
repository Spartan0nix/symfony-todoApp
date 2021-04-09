<?php

namespace App\Controller\Tag;

use App\Entity\Tag;
use App\Form\TagType;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class TagController extends AbstractController
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
     * @var Serializer
     */
    private $serializer;

    public function __construct(TagRepository $TagRepository, EntityManagerInterface $em)
    {
        $this->TagRepository = $TagRepository;
        $this->em = $em;

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);
    }

    /**
     * @Route("/tags",name="tag.index")
     * @return Response
     */
    public function index(Request $request): Response{

        // $users= $this->getDoctrine()->getRepository(User::class)->findAll();
        // $tags = $this->TagRepository->findAll();
        // foreach($users as $user){
        //     foreach($tags as $tag){
        //         $user->addTag($tag);
        //     }
        // }
        // $this->em->flush();

        $tags = $this->getUser()->getTags();

        $tag = new Tag();

        $form = $this->createForm(TagType::class, $tag);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            $tag = $form->getData();
            $tag->addUserId($this->getUser());

            $this->em->persist($tag);
            $this->em->flush();

            $this->addFlash('success','Tag créé avec succès.');
            return $this->redirectToRoute('tag.index');
        }

        if($form->isSubmitted() && !$form->isValid()){
            $this->addFlash("error", "Le tag n'a pas pu être ajouté");
        }

        return $this->render('tag/index.html.twig', [
            'tags' => $tags,
            'form' => $form->createView(),
            'userToken' => $this->getUser()->getApiToken()
        ]);
    }


}