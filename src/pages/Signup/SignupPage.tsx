import React from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
  IonList,
  IonListHeader,
  IonRouterLink,
  useIonRouter,
} from '@ionic/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

interface ISignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Updated regex for valid email addresses
      message: 'Enter a valid email address',
    },
  },
  name: {
    required: 'Name is required',
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long',
    },
  },
  confirmPassword: (password: string) => ({
    required: 'Please confirm your password',
    validate: (value: string) => value === password || 'Passwords do not match',
  }),
};

const SignupPage: React.FC = () => {
  const { signup, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignupForm>();

  const password = watch('password');


  const router = useIonRouter();

  const onSubmit: SubmitHandler<ISignupForm> = async (formData) => {
    const user = await signup(formData.email, formData.password, formData.name);
    if (user) {
      console.debug('User logged in', user);
      router.push('/tab1', 'forward', 'replace');
    }
  };
  

  return (
    <IonPage>
      <IonContent>
        <div className='ion-flex ion-justify-content-center ion-align-items-center' style={{height:'100%'}}>
        <IonList style={{width: '75%'}} lines='none'>
            <IonListHeader>
              <IonText><h1>Sign up</h1>
              </IonText>
            </IonListHeader>
            <IonItem>
              <IonLabel>Let’s create or find your account. We’ll send a security code to verify that it’s really you.</IonLabel>
            </IonItem>
            <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel>
                <IonInput
                  label='Email'
                  labelPlacement='floating'
                  type='email'
                  fill='outline'
                  {...register('email', validationRules.email)}
                />
                {errors.email && (  
                <IonText color='danger'>
                  <p>{errors.email.message}</p>
                </IonText>
                )}
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <IonInput
                  label='Name'
                  labelPlacement='floating'
                  type='text'
                  fill='outline'
                  {...register('name', validationRules.name)}
                />
                {errors.name && (
                  <IonText color='danger'>
                    <p>{errors.name.message}</p>
                  </IonText>
                )}
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <IonInput
                  label='Password'
                  labelPlacement='floating'
                  type='password'
                  fill='outline'
                  {...register('password', validationRules.password)}
                />
                {errors.password && (
                  <IonText color='danger'>
                    <p>{errors.password.message}</p>
                  </IonText>
                )}
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <IonInput
                  label='Comfirm Password'
                  labelPlacement='floating'
                  type='password'
                  fill='outline'
                  {...register('confirmPassword', validationRules.confirmPassword(password))}
                />
                {errors.confirmPassword && (
                  <IonText color='danger'>
                    <p>{errors.confirmPassword.message}</p>
                  </IonText>
                )}
              </IonLabel>
            </IonItem>

            <IonItem >
              <IonLabel>
                <IonButton 
                  size='default' 
                  expand='block' 
                  type='submit'
                  disabled={loading} 
                  className='ion-padding-top ion-padding-bottom'
                >
                  Sign up
                </IonButton>
              </IonLabel>
            </IonItem>

            </form>
            
            <IonItem>
              <IonLabel className='ion-text-center'>
                <IonRouterLink href='/signin'>Have an account? Sign in here</IonRouterLink>
              </IonLabel>
            </IonItem>
          </IonList>
          <IonLoading isOpen={loading} message={'Logging in...'} />
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;
