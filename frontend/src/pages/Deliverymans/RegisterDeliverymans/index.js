import React, { useState, useEffect } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { Form } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import {
  Container,
  Title,
  ContentForm,
  ContentItem,
  ContentInput,
} from './styles';

import Button from '~/components/Button';
import DefaultInput from '~/components/DefaultInput';
import api from '~/services/api';
import AvatarInput from '../AvatarInput';
import history from '~/services/history';
import {useSelector, useDispatch} from 'react-redux';
import {clearDeliveryman} from '~/store/modules/deliveryman/actions';

export default function RegisterDeliverymans() {

  const deliveryman= useSelector(state=>state.deliveryman.data);

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(()=>{
    async function loadData(){
      if(deliveryman){
        setNameInput(deliveryman.name);
        setEmailInput(deliveryman.email);
      }
    }

    loadData();
  },[])




  function handleInputName(e) {
    setNameInput(e.target.value);
  }
  function handleInputEmail(e) {
    setEmailInput(e.target.value);
  }

  const schema = Yup.object().shape({
    avatar_id:Yup.number(),
    name: Yup.string().required('O nome é obrigatório'),
    email: Yup.string().email().required('O email é obrigatório'),

  });

  async function saveNewDeliveryman({avatar_id, name, email}) {
     schema.validate({
      avatar_id,
      name,
      email,
    }, {abortEarly: false}).then(valid => {
      console.tron.log('valid:', valid)
    }).catch(err => {
      console.tron.log('err:', err.errors)
    })
    console.tron.log();

    if(deliveryman){
      await api.put(`/deliverymans/${deliveryman.id}`,{
        avatar_id,
        name,
        email,
      })
      .then(()=>{
        toast.success('Entregador atualizado com sucesso!');
        history.push('/deliverymans');
      })
      .catch((err)=>{
        console.tron.log(err.response);
        toast.error(err.response);
      });
    }
    else{
      await api
      .post('deliverymans', {
        avatar_id,
        name,
        email,
      })
      .then(() => {
        toast.success('Entregador cadastrado com sucesso!');
        history.push('/deliverymans');
      })
      .catch((err) => {
        console.tron.log(err.response);
        toast.error(err.response.data.error);
      });
    }

    // const avatar_id=document.getElementById("avatar").dataset.file;
    //console.tron.log(nameInput, emailInput, avatar_id);


  }

  const dispatch=useDispatch();
  function handleBack(){
    dispatch(clearDeliveryman());
    history.push('/deliverymans');
  }

  //console.tron.log(deliveryman);
  return (
    <>
      <Title>
      <header>
          {deliveryman === null ? <h1>Cadastro do entregador</h1> : <h1>Edição do entregador</h1>}
        </header>
      </Title>
      <Form initialData={deliveryman} schema={schema} onSubmit={saveNewDeliveryman}>
        <Container>
          {/* <Link to="/Deliverymans"> */}
          <Button background="#CCCCCC" onClick={handleBack}>
            <MdKeyboardArrowLeft color="#fff" size={25} />
            <strong>VOLTAR</strong>
          </Button>
          {/* </Link> */}
          <Button background="#7159c1" >
            <MdDone color="#fff" size={25} />
            <strong>SALVAR</strong>
          </Button>
        </Container>

        <ContentForm>
          <div>
             <AvatarInput
             name="avatar_id"
           />
          </div>
          <ContentItem>
            <strong>Nome</strong>
            <ContentInput>
              <DefaultInput
                name="name"
                type="text"
                placeholder="Digite o nome do entregador"
                onChange={handleInputName}
              />
            </ContentInput>
          </ContentItem>
          <ContentItem>
            <strong>Email</strong>
            <ContentInput>
              <DefaultInput
                name="email"
                type="email"
                placeholder="Digite o e-mail do entregador"
                onChange={handleInputEmail}
              />
            </ContentInput>
          </ContentItem>
        </ContentForm>
      </Form>
    </>
  );
}

