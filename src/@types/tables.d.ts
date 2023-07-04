export namespace Tables {
  export type User = {
    idUser: number;
    user: string;
    wtsId: string;
    email: string;
    emailHead: string;
  };
  export type Interaction = {
    idInteraction: number;
    interaction: string;
    dialog: string;
    startDay: Date;
    idUser: number;
  };

  export type Menu = {
    menuCode: number;
    menuName: string;
    parentCode: number;
  };
  export type Hour = {
    idHour: number;
    overTime: number;
    date: string;
    coment: string;
    taskNumber: string;
    idUser: number;
    checkHead: boolean;
    checkFinance: boolean;
    IncludeDate: Date;
  };
}
