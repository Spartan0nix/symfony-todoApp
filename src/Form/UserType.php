<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'attr' => [
                    'placeholder' => 'Entrer votre adresse mail ...',
                    'invalid_message' => 'Adresse mail non valide'
                ],
                'required' => true
            ])
            // ->add('roles')
            ->add('password', PasswordType::class, [
                'attr' => [
                    'placeholder' => 'Entrer votre mot de passe',
                    'invalid_message' => 'Mot de passe non valide'
                ],
                'required' => true
            ])
            // ->add('apiToken')
            // ->add('tags')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'translation_domain' => 'form'
        ]);
    }
}
