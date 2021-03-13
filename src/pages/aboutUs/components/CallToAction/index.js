import Section from '../Section';
import { Stack, Heading, Button } from '@kiwicom/orbit-components/lib';
import RedButton from '@components/buttons/RedButton';
import { useRouter } from 'next/router';

const CallToAction = () => {
  const router = useRouter();

  const routeToRegister = () => {
    router.push('/register');
  };

  return (
    <Section>
      <Stack direction="column" align="center">
        <Stack direction="column" align="center" justify="center">
          <Heading>Let's start fulfilling wishes!</Heading>
          <Button asComponent={RedButton} onClick={routeToRegister}>
            Donate now
          </Button>
        </Stack>
      </Stack>
    </Section>
  );
};

export default CallToAction;
