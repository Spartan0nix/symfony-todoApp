<?php

namespace App\Controller;

use App\Entity\Task;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/",name="homepage")
     * @return Response
     */
    public function index(): Response {
        return $this->render('homepage.html.twig');
    }

    /**
     * @Route("/test",name="test.index")
     * @return Response
     */
    public function test(Request $request): Response{

        // $task = $this->getDoctrine()->getRepository(Task::class)->find(83);
        // $task->setDueDate(new \DateTime('midnight +3days'));
        // $this->getDoctrine()->getManager()->flush();
        // dump($task);
       
        return $this->render('test/index.html.twig', [
            
        ]);
    }
}