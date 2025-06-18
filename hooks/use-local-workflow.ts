import { useLocalStorage } from "usehooks-ts";

type LocalWorkFlow = 

export default function useLocalWorkflow() {
    const [data, setData] = useLocalStorage('server-workflow', {})



}
