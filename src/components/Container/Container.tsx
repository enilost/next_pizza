import { cn } from "@/lib/utils";
import { FunctionComponent, PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren{
    style?:Record<string,string>
    className?:string
}
 
const Container: FunctionComponent<ContainerProps> = ({children,style,className}) => {
    return ( <div className={cn(' mx-auto max-w-[1280px] px-3',className)} style={style}>{children}</div> );
}
 
export default Container;