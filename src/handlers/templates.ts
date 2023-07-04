import { Tables } from "../@types/tables";

export const Templates = {
  dialogs: {
    registering: {
      registering_name: "Por favor, envie seu nome para cadastro.",
      registering_email: "Por favor, envie seu email para cadastro.",
      registering_head:
        "Por favor, envie o email do seu Head para cadastro. Caso você seja o Head, envie 0 para pular esta etapa.",
      registration_completed:
        "Cadastro concluído! Envie uma mensagem para utilizar o bot!",
    },
    hourMaking: {
      cadDate: "Favor informar a data da hora extra",
      cadHour: "Favor informar a quantidade de horas",
      cadTaskNum: "Favor informar o numero da task",
      cadComent: "deseja adicionar uma comentario",
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
  },
  hourResume: (hours: Tables.Hour[]) =>
    `${hours.map(
      (hours) =>
        `codigo de horas : ${hours.idHour}\ndata : ${hours.date}\nHoras : ${hours.overTime}\n Comentario : ${hours.coment}`
    )}`,
  email:{
    about:{
      head:'aguardando aprovação',
      fin:`aprovado pelo head`,
    },
    body:'',
    detail: '',
    emailSucess:'',
    emailFail:'',
    emailSending:'sbarbosa@pdasolucoes.com.br',
    emailFinance:'sbarbosa@pdasolucoes.com.br'
  },
};
