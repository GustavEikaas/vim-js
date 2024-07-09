import { draculaTheme } from "../theme/dracula";

type MappingsUsedProps = {
  spent: number;
  least: number;
}
export const MappingsUsed = ({ spent, least }: MappingsUsedProps) => {
  return (<div>Mappings used: <span style={{ color: spent > least ? draculaTheme.red : "inherit" }}>{spent}</span>/{least}</div>)
}
