export class Estilo{

    private estiloBtn:string;
    private estiloFondo:string;
    private correo:string;

  
    constructor(){
        this.correo = '';
        this.estiloBtn = '';
        this.estiloFondo = '';
    }

    public getCorreo(){
      return this.correo;
    }

    public getEstiloBtn(){
        return this.estiloBtn;
    }

    public getEstiloFondo(){
        return this.estiloFondo;
    }


    public setCorreo(mail:string):void{
      this.correo = mail;
    }

    public setEstiloBtn(estilo:string):void{
        this.estiloBtn = estilo;
    }

    public setEstiloFondo(estilo:string):void{
        this.estiloFondo = estilo;
    }

  
  
  
  }
  