interface AOMessageTag {
  name: string;
  value: string;
}

interface AOMessage {
  Anchor: string;
  Data: string;
  Tags: AOMessageTag[];
  Target: string;
}

interface AOOutput {
  data: string;
  print: boolean;
  prompt: string;
}
