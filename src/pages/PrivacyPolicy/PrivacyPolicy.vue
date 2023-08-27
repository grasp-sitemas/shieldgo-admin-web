<template>
    <div class="privacy-policy mt-4">
      <h1>Política de Privacidade</h1><br/>
      <p>
        Esta Política de Privacidade descreve como o aplicativo ShieldGo ("nós", "nosso" ou "aplicativo") coleta, usa e protege as informações pessoais dos usuários ("você" ou "seu") durante o uso de nossos serviços. Ao utilizar o aplicativo ShieldGo, você concorda com as práticas descritas nesta política.
      </p>
  
      <h2>1. Coleta de Informações</h2>
      <p>
        <strong>1.1. Informações Fornecidas por Você:</strong> Para utilizar os recursos do ShieldGo, podemos coletar informações como nome, endereço de e-mail, número de telefone e outras informações necessárias para o seu registro e autenticação.
      </p>
      <p>
        <strong>1.2. Informações de Uso:</strong> Coletamos informações sobre como você utiliza o aplicativo, incluindo interações com recursos, rondas, supervisões, checklists e relatórios de incidentes.
      </p>
      <p>
        <strong>1.3. Dados de Localização:</strong> Para otimizar a experiência do usuário e fornecer funcionalidades baseadas em localização, coletamos dados de localização quando você utiliza o aplicativo.
      </p>

      <h2>2. Uso das Informações</h2>
    <p>
      <strong>2.1. Fornecimento de Serviços:</strong> Utilizamos suas informações para fornecer, manter e aprimorar os serviços do ShieldGo, incluindo rondas, supervisões, checklists e relatórios de incidentes.
    </p>
    <p>
      <strong>2.2. Comunicações:</strong> Podemos enviar e-mails ou notificações relacionadas a atualizações do aplicativo, atividades de conta e outras informações relevantes.
    </p>
    <p>
      <strong>2.3. Análises:</strong> Usamos informações de uso para análises internas, como melhorias de recursos e otimização da experiência do usuário.
    </p>

    <!-- Restante do conteúdo... -->

    <h2>3. Compartilhamento de Informações</h2>
    <p>
      <strong>3.1. Parceiros de Serviço:</strong> Podemos compartilhar informações com parceiros de serviço que auxiliam na operação do aplicativo, como provedores de hospedagem em nuvem e serviços de análise.
    </p>
    <p>
      <strong>3.2. Requisitos Legais:</strong> Em conformidade com a legislação aplicável, podemos compartilhar informações em resposta a solicitações legais ou para proteger nossos direitos, privacidade, segurança ou propriedade.
    </p>

    <!-- Restante do conteúdo... -->

    <h2>4. Armazenamento e Segurança</h2>
    <p>
      <strong>4.1. Armazenamento em Nuvem:</strong> Os dados coletados são armazenados em servidores na plataforma de nuvem Heroku, garantindo um ambiente seguro e confiável.
    </p>
    <p>
      <strong>4.2. Criptografia:</strong> Dados sensíveis, como senhas, são armazenados de forma criptografada em nossa base de dados.
    </p>

    <!-- Restante do conteúdo... -->

    <h2>5. Acesso e Controle</h2>
    <p>
      <strong>5.1. Acesso às Informações:</strong> Você pode acessar e atualizar suas informações de perfil a qualquer momento através das configurações do aplicativo.
    </p>
    <p>
      <strong>5.2. Exclusão de Dados:</strong> Caso deseje excluir sua conta e informações, entre em contato conosco e processaremos sua solicitação conforme as leis aplicáveis.
    </p>

    <!-- Restante do conteúdo... -->

    <h2>6. Atualizações na Política de Privacidade</h2>
    <p>
      <strong>6.1. Notificações:</strong> Quaisquer atualizações nesta Política de Privacidade serão comunicadas através do aplicativo ou por meio de nossos canais de comunicação.
    </p>

    <!-- Restante do conteúdo... -->

    <h2>7. Contato</h2>
    <p>
      <strong>7.1. Dúvidas:</strong> Se tiver alguma dúvida sobre nossa Política de Privacidade, entre em contato conosco através do e-mail de suporte fornecido no aplicativo.
    </p>

    <p class="conclusion">
      O aplicativo ShieldGo valoriza a privacidade de seus usuários e está comprometido em garantir a proteção de suas informações pessoais. Ao usar o aplicativo, você concorda com os termos desta Política de Privacidade. Esta política está sujeita a mudanças, por isso é recomendável revisá-la periodicamente.
    </p>
  
      <!-- Restante das seções -->
  
      <p class="conclusion">
        O aplicativo ShieldGo valoriza a privacidade de seus usuários e está comprometido em garantir a proteção de suas informações pessoais. Ao usar o aplicativo, você concorda com os termos desta Política de Privacidade. Esta política está sujeita a mudanças, por isso é recomendável revisá-la periodicamente.
      </p>
    </div>
  </template>
  
<script>
import AppOptions from '../../config/AppOptions.vue';

export default {
  name: 'PrivacyPolicy',
  created() {
    AppOptions.appEmpty = true;
  },
};
</script>

<style scoped>
.privacy-policy {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.privacy-policy h1 {
  text-align: center;
}

.privacy-policy h2 {
  text-align: left;
  margin-top: 20px;
}

.privacy-policy strong {
  font-weight: bold;
}

.privacy-policy p {
  text-align: justify;
  margin-bottom: 20px;
}

.privacy-policy .conclusion {
  font-style: italic;
}
</style>