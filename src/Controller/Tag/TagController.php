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

    public function __construct(TagRepository $TagRepository, EntityManagerInterface $em)
    {
        $this->TagRepository = $TagRepository;
        $this->em = $em;
    }

    /**
     * @Route("/tags",name="tag.index")
     * @return Response
     */
    public function index(Request $request): Response{

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