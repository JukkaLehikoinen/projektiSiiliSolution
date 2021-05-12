import { useMutation } from "@apollo/client";
import { ARCHIVE_BOARD } from "../boardQueries";

const useArchiveBoard = () => {
  const retVal = useMutation(ARCHIVE_BOARD);
  return retVal;
};
export default useArchiveBoard;
