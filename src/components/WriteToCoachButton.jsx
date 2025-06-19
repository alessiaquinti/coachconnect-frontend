import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { Button, Flex, Text } from "@radix-ui/themes";

export default function WriteToCoachButton() {
  const [coach, setCoach] = useState(null);
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    axios
      .get("/me/coach")
      .then((res) => setCoach(res.data))
      .catch(() => setCoach(null));
  }, []);

  if (!coach) return null;

  return (
    <Flex direction="column" gap="2" className="mb-4">
      <Text size="3" weight="medium">
        Hai bisogno di scrivere al tuo coach?
      </Text>
      <Button
        onClick={() => {
          navigate(`/member/messages/${coach.id}`);
        }}
        className="bg-purple-600 text-white hover:bg-purple-700 transition-all"
      >
        Scrivi a {coach.name}
      </Button>
    </Flex>
  );
}
