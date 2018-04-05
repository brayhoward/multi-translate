import { apiKey } from '../secrets';
import { DOMParser } from 'xmldom';

export type Translation = {
  text: string,
  language: string
}

const urlBase = 'http://0.0.0.0:4000/api';

export const getTranslations = (text = '', isoCodes) => {
  const encodedText = encodeURI(text);
  const encodedIsoCodes = encodeURI(
    JSON.stringify(isoCodes)
  )
  const url = `${urlBase}/translate`;
  const query = `?text=${encodedText}&iso_codes=${encodedIsoCodes}`

  return handleFetch(`${url}${query}`)
}

export const getIsoTable = (): string[] => (
  handleFetch(`${urlBase}/iso-table`)
)

////////////////////////////////////////
//              PRIVATE               //
////////////////////////////////////////
const handleFetch = url => (
  fetch(
    url,
    {
      headers: { 'Api-key': apiKey }
    }
  )
  .then(resp => {
    if (resp.ok) return resp.text();
    // else
    throw new Error('Network error');
  })
  .then(json => JSON.parse(json))
  .then(payload => payload.data)
)