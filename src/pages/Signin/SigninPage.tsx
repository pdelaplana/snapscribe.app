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
import { useAuth } from '../../context/AuthContext';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ISigninForm {
  password: string;
  email: string;
}

const SigninPage: React.FC = () => {
  const { signin, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISigninForm>();

  const onSubmit: SubmitHandler<ISigninForm> = async (formData) => {
    const user = await signin(formData.email, formData.password);
    if (user) {
      console.debug('User logged in', user);
      router.push('/tab1', 'forward', 'replace');
    }
  };
  
  const router = useIonRouter();

  return (
    <IonPage>
      <IonContent>
        <div className='ion-flex ion-justify-content-center ion-align-items-center' style={{height:'100%'}}>
          <IonList style={{width: '75%'}} lines='none'>
            <IonListHeader>
              <IonText><h1>Sign in</h1></IonText>
            </IonListHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel>
                <IonInput
                  label='Email'
                  labelPlacement='floating'
                  type='email'
                  fill='outline'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email && (
                  <IonText color="danger">
                    <p>{errors.email.message}</p>
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
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                />
                {errors.password && (
                  <IonText color="danger">
                    <p>{errors.password.message}</p>
                  </IonText>
                )}
              </IonLabel>
            </IonItem>
            
            <IonItem tabIndex={0}>
              <IonLabel>
                <IonButton size='default' expand='block' type='submit' disabled={loading} className='ion-padding-top ion-padding-bottom'>
                  Sign in
                </IonButton>
              </IonLabel>
            </IonItem>
            </form>
            
            <IonItem tabIndex={0}>
              <IonLabel className='ion-text-center'>
                <IonRouterLink href="" >Forgot Password?</IonRouterLink>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className='ion-text-center'>
                <IonRouterLink href="/signup">Don't have an account? Sign up</IonRouterLink>
              </IonLabel>
            </IonItem>
          </IonList>
          <IonLoading isOpen={loading} message={'Logging in...'} />
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default SigninPage;
