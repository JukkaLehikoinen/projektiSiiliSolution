import { useMutation } from "@apollo/client";
import { ARCHIVE_PROJECT } from "../projectQueries";

const useArchiveProject = () => {
  const retVal = useMutation(ARCHIVE_PROJECT);
  return retVal;
};
export default useArchiveProject;
