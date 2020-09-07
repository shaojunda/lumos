import test from "ava";
import {
  ExtendedPublicKey,
  AccountExtendedPublicKey,
  ExtendedPrivateKey,
  AddressType,
} from "../src";

const fixture = {
  privateKey:
    "0xe8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35",
  publicKey:
    "0x0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2",
  chainCode:
    "0x873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508",
};

test("ExtendedPublicKey, serialize and parse", (t) => {
  const extendedKey = new ExtendedPublicKey(
    fixture.publicKey,
    fixture.chainCode
  );
  const serialized = extendedKey.serialize();
  const parsed = ExtendedPublicKey.parse(serialized);
  t.is(parsed.publicKey, fixture.publicKey);
  t.is(parsed.chainCode, fixture.chainCode);
});

const extendedKey = new AccountExtendedPublicKey(
  "0x03e5b310636a0f6e7dcdfffa98f28d7ed70df858bb47acf13db830bfde3510b3f3",
  "0x37e85a19f54f0a242a35599abac64a71aacc21e3a5860dd024377ffc7e6827d8"
);

test("AccountExtendedPublicKey, key from extended public key", (t) => {
  t.is(
    // @ts-ignore: Private method
    extendedKey.getPublicKey(AddressType.Receiving, 0),
    "0x0331b3c0225388c5010e3507beb28ecf409c022ef6f358f02b139cbae082f5a2a3"
  );
  t.is(
    // @ts-ignore: Private method
    extendedKey.getPublicKey(AddressType.Change, 1),
    "0x0360bf05c11e7b4ac8de58077554e3d777acd64bf4abb9cd947002eb98a4827bba"
  );
});

test("AccountExtendedPublicKey, serialize and parse", (t) => {
  const serialized = extendedKey.serialize();
  const parsed = AccountExtendedPublicKey.parse(serialized);
  t.is(parsed.publicKey, extendedKey.publicKey);
  t.is(parsed.chainCode, extendedKey.chainCode);
});

test("AccountExtendedPublicKey, derive address", (t) => {
  const receivingBlake160Info = extendedKey.publicKeyInfo(
    AddressType.Receiving,
    0
  );
  t.is(receivingBlake160Info.path, `m/44'/309'/0'/0/0`);

  const changeBlake160Info = extendedKey.publicKeyInfo(AddressType.Change, 1);
  t.is(changeBlake160Info.path, `m/44'/309'/0'/1/1`);
});

test("ExtendedPrivateKey, serialize and parse", (t) => {
  const extendedKey = new ExtendedPrivateKey(
    fixture.privateKey,
    fixture.chainCode
  );
  const serialized = extendedKey.serialize();
  const parsed = ExtendedPrivateKey.parse(serialized);
  t.is(parsed.privateKey, fixture.privateKey);
  t.is(parsed.chainCode, fixture.chainCode);
});

test("ExtendedPrivateKey, derivate extended public key", (t) => {
  const extendedKey = new ExtendedPrivateKey(
    fixture.privateKey,
    fixture.chainCode
  ).toExtendedPublicKey();
  t.is(extendedKey.publicKey, fixture.publicKey);
  t.is(extendedKey.chainCode, fixture.chainCode);
});