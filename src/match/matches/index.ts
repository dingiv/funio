
export interface NumberPattern {

}

interface StringPattern {
   startsWith(): any;
   endsWith(): any;
   includes(): any;
   regex(): any;
   asBool(): any;
   asInt(): any;
   asFloat(): any;
   asJSON(): any;
   template(): any
}

interface RangePattern {

}

interface ArrayPattern {
   length(): any;
   empty(): any;
   notEmpty(): any;
   includes(): any;
   notIncludes(): any;
   every(): any;
   some(): any;
}

interface SetPattern {

}

interface MapPattern {

}
