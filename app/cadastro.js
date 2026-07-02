import {
    View, // Para agrupar elementos (= div)
    Text, // Para exibir textos (= p, h1...)
    TouchableOpacity, // Para botões clicáveis (= button)
    ScrollView, // Para a área principal com scroll,
    StyleSheet, // Para aplicar estilo na página
    TextInput
   } from 'react-native'; // Importa os componentes View e Text
   import {Link} from 'expo-router';
   import {useState} from 'react';
   const API_URL = "http://localhost:3000"
   
  export default function Cadastro() {
    const[nome,setNome] = useState('');
    const[email,setEmail] = useState('');
    const[senha,setSenha] = useState('');
    const[confirmarSenha,setConfirmarSenha] = useState('');

    const[mensagemSistema,setMensagemSistema] = useState('');
    const[tipoMensagem,setTipoMensagem] = useState('');

   async function validarCadastro(){
    if(nome === ''){
      setMensagemSistema("Digite seu nome!");
      setTipoMensagem("erro");
      return
    }

    if(/\d/.test(nome)){
      setMensagemSistema("O nome não pode conter número!");
      setTipoMensagem("erro");
      return
    }

    if(email === ''){
      setMensagemSistema("Digite seu email!");
      setTipoMensagem("erro");
      return
    }
    if(!email.includes("@") || !email.includes(".com")){
      setMensagemSistema("Digite um e-mail válido!");
      setTipoMensagem("erro");
      return
    }

    if(senha === ''){
      setMensagemSistema("Digite sua senha!");
      setTipoMensagem("erro");
      return
    }

    if(senha.length < 6 ){
      setMensagemSistema("A senha deve ter pelo menos 6 caracteres!");
      setTipoMensagem("erro");
      return
    }

    if(confirmarSenha === ''){
      setMensagemSistema("Digite novamente sua senha!");
      setTipoMensagem("erro");
      return
    }
    
    if(confirmarSenha.length < 6 ){
      setMensagemSistema("A senha deve ter pelo menos 6 caracteres!");
      setTipoMensagem("erro");
      return
    }

    if(senha !== confirmarSenha){
      setMensagemSistema("As senhas devem ser iguais.");
      setTipoMensagem("erro");
      return
    }
    //Tenta executar o bloco, se houver erro de rede, o código vai para o cath
    try{
      // Faz uma requisição HTTP para a rota da API usando o método POST
      const resposta = await fetch(`${API_URL}/cadastro`,{
        method: 'POST', // Define que a requisição vai ENVIAR DADOS
        headers: {'Content-Type': 'application/json'}, // Informa que o corpo da requisição está JSON
        credentials:'include', // Inclui cookies e sessão na requisição, útil para autenticação
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha
        }) // Converte os dados de JavaScript para texto JSON antes de enviar
      });
      // Converte a resposta recebida da API de JSON para objeto JavaScript
      const dados = await resposta.json() 

      // Verifica se a resposta HTTP foi de sucesso
      if(resposta.ok){
        // Mostra a mensagem de sucesso vinda da API, 
          //ou um texto padrão se ela não enviar nada
        setMensagemSistema(dados.mensagem || "Cadastro realizado")
        // Define o "estilo" da mensagem como sucesso
        setTipoMensagem("sucesso")
        // Limpa os campos do formulário
        setNome('')
        setEmail('')
        setSenha('')
        setConfirmarSenha('')
      } else{
        // Mostra a mensagem de erro vinda da API,
          // ou um texto padrão se ela não enviar nada
        setMensagemSistema(dados.erro || "Erro ao cadastrar")
        // Define o "estilo" da mensagem como erro
        setTipoMensagem("erro") 
      }
    }catch(erro){
      //  Executado quando acontece falha na conexão,
        // como internet fora do ar ou servidor indisponivel
      setMensagemSistema("Erro ao conectar com o servidor")
      // Define o "estilo" da mensagem como erro
      setTipoMensagem("erro")
    }
  }

   return (
      <ScrollView>
          { /*=========== TOPO (HEADER) =============*/}
          { /*=========== Área de cabeçalho com logo e menu =============*/}
     

          { /*=========== CONTEÚDO DA PÁGINA =============*/}
          <View style={styles.container}>
            <View style={styles.paginaAuth}>
                <Text style={styles.tituloAuth}>
                  Cadastro
                </Text>
                <Text style={styles.textoAuth}>
                  Crie sua conta para acessar nossa pagina 
                </Text>

                <View style={styles.blocoAuth}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput placeholder='Digite seu nome'
                            value={nome} 
                            onChangeText={setNome}
                            style={styles.input}>
                  </TextInput>
                
                  <Text style={styles.label}>Email</Text>
                  <TextInput placeholder='Digite seu email' 
                             keyboardType='email-address'
                             value={email} 
                             onChangeText={setEmail}
                             style={styles.input}>
                  </TextInput>

                  <Text style={styles.label}>Senha</Text>
                  <TextInput placeholder='Digite sua senha' 
                             secureTextEntry={true}
                             value={senha} 
                             onChangeText={setSenha}
                             style={styles.input}>
                  </TextInput>

                  <Text style={styles.label}>Confirma senha</Text>
                  <TextInput placeholder='Digite sua senha novamente' 
                             secureTextEntry={true}
                             value={confirmarSenha} 
                             onChangeText={setConfirmarSenha}
                             style={styles.input}>
                  </TextInput>

                  <TouchableOpacity style = {styles.btnPrimario} 
                                    onPress={validarCadastro}>
                    <Text style= {styles.textoBotao}>
                      Cadastrar
                    </Text>
                  </TouchableOpacity>

                  <Text style={tipoMensagem === "erro" ? 
                              styles.mensagemErro : styles.mensagemSucesso}>{mensagemSistema}</Text>

                  <Text style={styles.linkAuth}>
                    Já possui uma conta?
                  </Text>
                  <Link style={styles.linkAuthDestaque} href='/login'>
                    <Text>
                      Fazer Login
                    </Text>
                  </Link>
                

              </View>
            </View>
          </View>

          { /*=========== RODAPÉ =============*/}
          { /* Parte final da página */}
       
  
      </ScrollView>
   );
  }
  
  const styles = StyleSheet.create(
    {
      topo: {
        backgroundColor: '#1a4db3',
        padding:20,
        alignItems: 'center',
        gap: 10,
      },
  
      logoP1: {
        color:'#ffffff',
        fontSize:24,
        fontWeight: 'bold',
      },
  
      logoP2: {
        color:'#ff6a00',
        fontSize:24,
        fontWeight: 'bold',
      },
  
      menu: {
        marginTop: 10,
        alignItems: 'center',
        gap: 10,
      },
  
      menuItem: {
        color: '#ffffff',
        fontWeight: 'bold',
      },
  
      ativo: {
        color: '#ff6a00',
      },
  
      container: {
        padding: 20,
      },

      paginaAuth: {
        paddingVertical: 40,
        paddingHorizontal: 20,
      },

      blocoAuth: {
        backgroundColor: '#ffffff',
        gap: 10,
        padding: 30,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        },

        mensagemAuth: {
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 20,
        },

        linkAuth: {
            textAlign:'center',
            marginTop: 20,
            color: '#222',
            fontWeight: 'bold'
        },

        linkAuthDestaque: {
            color: "#1a4db3",
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 5,
        },

        tituloAuth: {
            color: '#1a4db3',
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
        },

        textoAuth: {
            textAlign: 'center',
            marginBottom: 20,
            color: '#555',
            fontSize: 16
        },

        label: {
            fontWeight: 'bold',
            color: '#222'
        },

        input: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            fontSize: 16,
            backgroundColor: '#ffffff'
        },

        btnPrimario: {
          backgroundColor: '#ff6a00',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginTop: 10
        },

        textoBotao: {
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center'
        },

        mensagemSucesso: {
          textAlign: 'center',
          fontWeight: 'bold',
          color:"green",
          marginTop: 15
      },

      mensagemErro: {
        textAlign: 'center',
        fontWeight: 'bold',
        color:"red",
        marginTop: 15
      },
      
      rodape: {
        backgroundColor: '#1a4db3',
        padding: 20,
        alignItems: 'center',
        gap: 8,
      },
  
      textoRodape: {
        color : '#ffffff',
        textAlign: 'center', 
        marginBottom: 8,
      },
  
      linkRodape: {
        color: '#ff6a00',
        fontWeight: 'bold',
        textDecorationLine: 'none'
      },
  
      tituloDestaque : {
        color: '#1a4db3',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
      }
  
    }
  )