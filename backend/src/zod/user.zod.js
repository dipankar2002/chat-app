import zod from 'zod';

const userSignupZod = zod.object({
  email: zod.string().email(),
  name: zod.string().min(1),
  username: zod.string().min(1),
  password: zod.string().min(6),
});

const userLoginZod = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

export { 
  userSignupZod,
  userLoginZod
};