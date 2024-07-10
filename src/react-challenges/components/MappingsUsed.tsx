type MappingsUsedProps = {
  spent: number;
  least: number;
}
export const MappingsUsed = ({ spent, least }: MappingsUsedProps) => {
  return (
    <div>Mappings used: 
      <span className={`${spent > least ? "text-red" : "text-black"}`}> {spent}</span>/{least}
    </div>
  )
}
