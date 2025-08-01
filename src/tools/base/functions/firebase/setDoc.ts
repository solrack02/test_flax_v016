
// ---------- import Local Tools
import { getCtData, testVarType } from '../../project';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  Timestamp,
} from 'firebase/firestore';

export const css1 =
  'color: green; background-color: black; font-size: 11px; padding: 2px 6px; border-radius: 3px';
export const css2 =
  'color: yellow; background-color: green; font-size: 10px; padding: 2px 6px; border-radius: 3px';

type Tprops = {
  args: any;
  pass: {
    arrRefStrings: string[];
    arrPathData: string[];
    arrFuncs: any[];
  };
};

export const setDocTool = async (props: Tprops) => {
  // ---------- set Props
  const { args, pass } = props;
  const { arrRefStrings, arrPathData, arrFuncs } = pass;

  // -----------------------------
  // ---------- set Firestore Call
  // -----------------------------
  const newArrStringRefs = arrRefStrings.map(i => {
    const varValue = testVarType(i, args);
    return varValue;
  });

  console.log('3', { newArrStringRefs });

  const fbInit = getCtData('all.temp.fireInit');
  const fireInit = getFirestore(fbInit);
  console.log({ fireInit });
  const refColl = collection(fireInit, ...newArrStringRefs);
  const refDoc = doc(refColl);

  // ------ check Data
  if (!Array.isArray(arrRefStrings))
    return console.log('newArrRef needs to be a string array', newArrRef);

  // ------ read Data
  let dataToSet = {};
  const newPath = arrPathData.map(i => {
    const varValue = testVarType(i, args);
    return varValue;
  });
  dataToSet = getCtData(newPath.join('.'));

  // ------ add new id
  dataToSet.docId = refDoc.id;
  dataToSet.createdAt = Timestamp.now();

  await setDoc(refDoc, dataToSet).catch(err =>
    console.log('Erro do setDoc', { err }),
  );

  // ---------- set Get Value Functions
  for (const currFunc of arrFuncs) await currFunc(dataToSet, args);

  console.log('%csetDoc ok', css1);
  console.log('%cReferencia do Documento', css2, {
    newArrStringRefs,
    dataToSet,
  });

  return dataToSet;
};

