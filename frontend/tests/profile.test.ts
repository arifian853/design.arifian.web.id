import { describe, expect, test } from 'bun:test';
import { parsePublicProfiles, validateProfile, type DesignProfile } from '../src/lib/profile';

const fixture = (key: string, label: string): DesignProfile => ({
  key, label, recipe:'tiles',
  colors:{background:'#f5f4ed',foreground:'#141413',surface:'#faf9f5',primary:'#c96442',onPrimary:'#141413',border:'#f0eee6'},
  typography:{body:'Inclusive Sans',heading:'Lexend Deca',scale:'7rem'},
  shape:{radius:'0px',border:'1px',shadow:'none'},
  density:{gap:'24px',padding:'24px'},
  motion:{duration:240,distance:4},
});

describe('public Terracotta profile boundary',()=>{
  test('accepts exactly the approved complete Terracotta runtime profile',()=>{
    const terracotta=fixture('terracotta','Terracotta');
    expect(parsePublicProfiles([terracotta])).toEqual([terracotta]);
    expect(validateProfile(terracotta)).toBe(true);
  });
  test('rejects any alternate profile or palette from the public UI-kit payload',()=>{
    const terracotta=fixture('terracotta','Terracotta');
    expect(()=>parsePublicProfiles([fixture('rosewood-subtle','Rosewood / Subtle')])).toThrow();
    expect(()=>parsePublicProfiles([terracotta,fixture('forest','Forest')])).toThrow();
    expect(()=>parsePublicProfiles([{...terracotta,key:'forest',label:'Forest'}])).toThrow();
  });
  test('rejects private source fields and executable color strings',()=>{
    const terracotta=fixture('terracotta','Terracotta');
    expect(()=>parsePublicProfiles([{...terracotta,sourceText:'# private source'}])).toThrow();
    expect(()=>parsePublicProfiles([{...terracotta,colors:{...terracotta.colors,primary:'url(https://bad.test)'}}])).toThrow();
  });
  test('validates the design source shape without allowing arbitrary values',()=>{
    expect(validateProfile(fixture('terracotta','Terracotta'))).toBe(true);
    expect(validateProfile({...fixture('terracotta','Terracotta'),shape:{radius:'-1px',border:'1px',shadow:'none'}})).toBe(false);
    expect(validateProfile({...fixture('terracotta','Terracotta'),typography:{body:'url(https://bad.test)',heading:'Lexend Deca',scale:'7rem'}})).toBe(false);
  });
});
