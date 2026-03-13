import ConsultaModule from "./ConsultaModule";
import RedaccioModule from "./RedaccioModule";
import QuestionariModule from "./QuestionariModule";

export default function ModuleRenderer({ folder }) {
  if (!folder) return <p>Selecciona una carpeta</p>;

  switch (folder.moduleType?.toLowerCase()) {
    case "consulta":
      return <ConsultaModule folder={folder} />;

    case "redaccio":
      return <RedaccioModule folder={folder} />;

    case "questionari":
      return <QuestionariModule folder={folder} />;

    default:
      return (
        <div>
          <h1>{folder.name}</h1>
          <p>Mòdul no definit.</p>
        </div>
      );
  }
}
