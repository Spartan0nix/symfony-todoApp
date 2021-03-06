<?php

namespace App\Form;

use App\Entity\Tag;
use App\Entity\Task;
use App\Repository\TagRepository;
use DateTime;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TaskType extends AbstractType
{
    /**
     * @var TagRepository
     */
    private $tagRepository;
    // /**
    //  * @var DateTime
    //  */
    // private $currentDate;

    public function __construct(TagRepository $tagRepository)
    {
        $this->tagRepository = $tagRepository;
        // $this->currentDate = new DateTime('now');
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $tags = $this->tagRepository->findAll();

        $builder
            ->add('title', TextType::class, [
                'attr' => [
                    'placeholder' => 'Entrer le titre ....'
                ]
            ])
            ->add('description', TextareaType::class, [
                'attr' => [
                    'placeholder' => 'Entrer une description (Facultatif)'
                ],
                'required' => false
            ])
            ->add('tags_id', EntityType::class, [
                'class' => Tag::class,
                'required' => false,
                'multiple' => true,
                'expanded' => true,
                'choices' => $tags,
                'choice_attr' => function(Tag $tag){
                    return ['color' => $tag->getColor()];
                },
                'choice_label' => function(Tag $tag){
                    if($tag){ return $tag->getName(); }
                }

            ])
            ->add('due_date', DateType::class, [
                'placeholder' => [
                    'year' => 'Année', 
                    'month' => 'Mois', 
                    'day' => 'Jour'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Task::class,
            'translation_domain' => 'form'
        ]);
    }
}
