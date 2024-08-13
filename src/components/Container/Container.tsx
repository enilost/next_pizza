import { cn } from "@/lib/utils";
import { FunctionComponent, PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren{
    style?:Record<string,string>
}
 
const Container: FunctionComponent<ContainerProps> = ({children,style}) => {
    return ( <div className={cn(' mx-auto max-w-[1280px]')} style={style}>{children}</div> );
}
 
export default Container;