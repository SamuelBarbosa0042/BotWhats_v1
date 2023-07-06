import { Tables } from "../@types/tables";

export const Templates = {
  dialogs: {
    registering: {
      registering_name: "Por favor, digite seu nome para cadastro.",
      registering_email: "Por favor, digite seu email para cadastro.",
      registering_head:
        "Por favor, digite o email do seu Head para cadastro. Caso você seja Head, digite 0.",
      registration_completed:
        "Cadastro concluído! Envie uma mensagem para utilizar o bot!",
    },
    sendMessage: (idArchive: any) => `Funcionario ${name}\n\nid Arquivo : ${idArchive}`,
    hourMaking: {
      cadDate: "Favor informar a data da hora extra",
      cadHour: "Favor informar a quantidade de horas",
      cadTaskNum: "Favor informar o numero da task",
      cadComent: "Adicione um comentário",
      cadComplete:
        "Hora registrada com sucesso\nDigite 1 caso deseje registrar outra" +
        "\nDigite qualquer outra coisa pra voltar pro menu inicial",
    },
    excludeHour: {
      isHours: "Escolha o código da hora que deseja excluir",
      isntHours: "Não existem nenhuma hora declarada",
    },
    emailInfo: {
      emailNotHead : "Seu numero não é HEAD\nSelecione um novo item do menu"
    }
  },
  messages: {
    already_registered:
      "Você já está cadastrado. Para se recadastrar, envie /recadastrar",
    not_implemented: "Funcionalidade ainda não implementada :)",
  },
  menu: (options: Tables.Menu[]) =>
    `Selecione uma das opções abaixo:\n${options
      .map((option, index) => `${index + 1}. ${option.menuName}`)
      .join("\n")}\n0. Cancelar`,
  operation: {
    canceled: "Operação cancelada pelo usuario",
    invalid: "operação invalida, seleciona código valido",
    wishContinue: "Digite outro código para aprovar ou 0 para cancelar"
  },
  hourResume: (hours: Tables.Hour[]) =>
    `${hours.map(
      (hours) =>
        `codigo de horas : ${hours.idHour}\ndata : ${hours.date}\nHoras : ${hours.overTime}\n Comentario : ${hours.coment}`
    )}`,
  email:{
    about:{
      head:'aguardando aprovação',
      fin:(head: string) => `aprovado pelo head ${head}`,
    },
    body:'', //http + css 
    detail: '',
    emailSucess:'',
    emailFail:'',
    emailSending:'sbarbosa@pdasolucoes.com.br',
    emailFinance:'sbarbosa@pdasolucoes.com.br',
    sucess: 'Email Enviado com sucesso'
  },
};
