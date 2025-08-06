type AppErrorType = {
  name: string;
  cause: string;
  message: string;
  stack: string;
};

export class AppError {
  private readonly _self;
  private readonly constructMessage =(method:string,message:string)=>`${this._self.name}:${method}:${message}`

  constructor(self: any) {
    this._self = self;
  }

  error(method: any, e: any) {
    let _message = ""

      if(e?.name==="ZodError"){
        const {message} = this.validateZodError(e)
        _message = message
      }else{
        _message = e?.message
     }

    return {
      name: "AppError",
      cause: e.cause ?? e?.message,
      message: this.constructMessage(method.name,_message),
      stack: e?.stack,
    }
  }

  validateZodError(e:any){
    if(e?.name==="ZodError"){
        let errorMessage = e?.message
        
        const message = e?.message as string;

        if(message.startsWith("[")){
            console.log("Parsing ZodError Message...")
            const parsedErrors = JSON.parse(message);
            console.log(parsedErrors)
            const errorSegment = parsedErrors[0]
            errorMessage = this.constructZodError(errorSegment)
        }

        return {
            zodError:true,
            message:errorMessage
        }
    }

    return {
        zodError:false,
    }
  }

  constructZodError(zodError:Record<string,any>){
    console.log("constructing error message...")
    console.log(zodError)
    switch(zodError.code){
      case"invalid_type":
        return `${zodError.message} ${zodError.expected} but received ${zodError?.received} at path ${zodError.path[0]}`
      case "too_small":
        return `${zodError.message} at path ${zodError.path.join(".")}`;
      case "unrecognized_keys":
        return `${zodError.message?.replace(/:/g," path -> ")}`
      default:
        return `${zodError.message}`
    }
  }
}

export const stripAppErrorMessage = (e: AppErrorType) => {
  const errorSegments = e?.message.split(":");

  const lastSegmentString = errorSegments[errorSegments.length - 1];

  return lastSegmentString;
};
