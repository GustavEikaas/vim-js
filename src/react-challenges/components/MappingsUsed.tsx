type MappingsUsedProps = {
  spent: number;
  least: number;
}
export const MappingsUsed = ({ spent, least }: MappingsUsedProps) => {
  const textColorClass = spent > least ? "text-red" : "text-black";
  return (<div>Mappings used: <span className={textColorClass}>{spent}</span>/{least}</div>)
}
