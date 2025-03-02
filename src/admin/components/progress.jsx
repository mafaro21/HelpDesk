import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  // useDisclosure,
  Button,
  useToast,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CheckIcon, RepeatIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Progress({ request }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReverseOpen, setIsReverseOpen] = useState(false);
  const [isUnfinishedOpen, setIsUnfinishedOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedRow, setSelectedRow] = useState("");
  const cancelRef = useRef();
  const cancelReverseRef = useRef();
  const unfinishedRef = useRef();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const adminRole = useAuthStore((state) => state.auth.user.role);
  const logoutAuthUser = useAuthStore((state) => state.logoutAuthUser);

  const onOpen = (ticket) => {
    setSelectedTicket(ticket);
    setIsOpen(true);
  };

  const onReverseOpen = (ticket) => {
    setSelectedTicket(ticket);
    setIsReverseOpen(true);
  };

  const onUnfinishOpen = (ticket) => {
    setSelectedTicket(ticket);
    setIsUnfinishedOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setIsReverseOpen(false);
    setIsUnfinishedOpen(false);
    setSelectedTicket(null);
  };

  const { data: data, error } = useQuery({
    queryKey: ["progress"],
    queryFn: () =>
      axios
        .get(`http://localhost:8888/${request}/progress`, {
          withCredentials: true,
        })
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status === 401) {
            logoutAuthUser();
            navigate("/admin");
            return;
          }
          toast({
            title: "Error",
            description: err.response.data,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        }),
  });

  // if (error) return toast({
  //     title: "Error fetching database data",
  //     description: "more text",
  //     status: "error",
  //     duration: 4000,
  //     isClosable: true,
  //     position: "top-right",
  // });

  const finishMutation = useMutation({
    mutationFn: (finish) => {
      return axios.put(
        `http://localhost:8888/${request}/progress/update`,
        finish,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Ticket is now finished",
        description: "Ticket is now closed",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      // queryClient.refetchQueries({ queryKey: ["pending"] });
    },
    onError: (err) => {
      if (err.response.status === 401) {
        logoutAuthUser();
        navigate("/admin");
        return;
      }
      toast({
        title: "Error",
        description: err.response.data || "Failed to update the ticket",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const handleUpdate = () => {
    onClose();

    finishMutation.mutate({
      id: selectedTicket.id,
    });
  };

  const reversalMutation = useMutation({
    mutationFn: (reverse) => {
      return axios.put(
        `http://localhost:8888/${request}/progress/reverse`,
        reverse,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Ticket has been reversed",
        description: "Ticket is now back in pending",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      // queryClient.refetchQueries({ queryKey: ["pending"] });
    },
    onError: (err) => {
      if (err.response.status === 401) {
        logoutAuthUser();
        navigate("/admin");
        return;
      }
      toast({
        title: "Error",
        description: err.response.data || "Failed to update the ticket",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const handleReversal = () => {
    onClose();

    reversalMutation.mutate({
      id: selectedTicket.id,
    });
  };

  const unfinishMutation = useMutation({
    mutationFn: (reverse) => {
      return axios.put(
        `http://localhost:8888/${request}/progress/unfinished`,
        reverse,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Ticket is now unfinished",
        description: "Ticket has been marked as unfinished",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      // queryClient.refetchQueries({ queryKey: ["pending"] });
    },
    onError: (err) => {
      if (err.response.status === 401) {
        logoutAuthUser();
        navigate("/admin");
        return;
      }
      toast({
        title: "Error",
        description: err.response.data || "Failed to update the ticket",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const handleUnfinish = () => {
    onClose();

    unfinishMutation.mutate({
      id: selectedTicket.id,
    });
  };

  const options = {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit',
    hour12: false,
  };

  const handleRowClick = (id) => {
    setSelectedRow(id);

    if (selectedRow === id) {
      setSelectedRow("");
    }
  };

  return (
    <>
      <Box mt={4}>
        <Text textAlign={"right"}>
          {data == 0
            ? "No Tickets to display"
            : data
            ? "Count: " + data.length
            : null}
        </Text>

        <TableContainer border={"1px solid #4c4c4c"} mt={2}>
          <Table>
            <Thead fontSize={"8px"}>
              <Tr>
                {/* <Th>ID</Th> */}
                <Th>Name</Th>
                <Th>Department</Th>
                <Th>Date of Applicaton</Th>
                <Th>Date Accepted</Th>
                <Th>Description</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>it officer</Th>
                {adminRole === "admin" ? <Th>Finish</Th> : null}
                {adminRole === "admin" ? <Th>Reverse</Th> : null}
                {adminRole === "admin" ? <Th>Unfinish</Th> : null}
              </Tr>
            </Thead>
            {
              // data.length == [] ?

              //     <Center mt={4}>There are no tickets in progress</Center>
              //     :
              data?.map((info) => (
                <Tbody className="row" onClick={() => handleRowClick(info.id)}>
                  <Tr
                    key={info.id}
                    style={{
                      backgroundColor: selectedRow === info.id ? "#0006cf" : "",
                    }}
                    className={selectedRow === info.id ? "row" : ""}
                  >
                    {/* <Td>{info.id}</Td> */}
                    <Td>{info.name}</Td>
                    <Td>{info.department}</Td>
                    <Td>
                      {new Date(info.date).toLocaleDateString("en-GB", options)}
                    </Td>
                    <Td>
                      {new Date(info.action_date).toLocaleDateString(
                        "en-GB",
                        options
                      )}
                    </Td>
                    <Td>{info.description}</Td>
                    <Td>{info.request_type}</Td>
                    <Td>{info.status}</Td>
                    <Td>{info.it_officer}</Td>
                    {adminRole === "admin" ? (
                      <Td
                        onClick={() => onOpen(info)}
                        _hover={{ backgroundColor: "green" }}
                        style={{ width: "1%" }}
                      >
                        <Center>
                          <CheckIcon />
                        </Center>
                      </Td>
                    ) : null}

                    {adminRole === "admin" ? (
                      <Td
                        onClick={() => onReverseOpen(info)}
                        _hover={{ backgroundColor: "blue" }}
                        style={{ width: "1%" }}
                      >
                        <Center>
                          <RepeatIcon />
                        </Center>
                      </Td>
                    ) : null}

                    {adminRole === "admin" ? (
                      <Td
                        onClick={() => onUnfinishOpen(info)}
                        _hover={{ backgroundColor: "orange" }}
                        style={{ width: "1%" }}
                      >
                        <Center>
                          <ArrowRightIcon />
                        </Center>
                      </Td>
                    ) : null}
                  </Tr>
                </Tbody>
              ))
            }
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              isOpen={isOpen}
              isCentered
            >
              <AlertDialogOverlay />

              <AlertDialogContent
                bg={"#101010"}
                border={"1px solid white"}
                color={"white"}
              >
                <AlertDialogHeader>Complete Ticket?</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  {selectedTicket ? (
                    <>
                      Are you sure that{" "}
                      <Text as={"b"}>{selectedTicket.name}'s</Text> ticket is
                      completed??
                    </>
                  ) : (
                    "No ticket selected"
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} colorScheme="red">
                    No
                  </Button>
                  <Button
                    colorScheme="green"
                    ml={3}
                    onClick={() => {
                      handleUpdate();
                    }}
                  >
                    Yes
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* reversal  */}
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={cancelReverseRef}
              onClose={onClose}
              isOpen={isReverseOpen}
              isCentered
            >
              <AlertDialogOverlay />

              <AlertDialogContent
                bg={"#101010"}
                border={"1px solid white"}
                color={"white"}
              >
                <AlertDialogHeader>Ticket Reversal?</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  {selectedTicket ? (
                    <>
                      Are you sure that you want to reverse{" "}
                      <Text as={"b"}>{selectedTicket.name}'s</Text> ticket and
                      send back to pending??
                    </>
                  ) : (
                    "No ticket selected"
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} colorScheme="red">
                    No
                  </Button>
                  <Button
                    colorScheme="blue"
                    ml={3}
                    onClick={() => {
                      handleReversal();
                    }}
                  >
                    Yes
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* unfinish */}
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={unfinishedRef}
              onClose={onClose}
              isOpen={isUnfinishedOpen}
              isCentered
            >
              <AlertDialogOverlay />

              <AlertDialogContent
                bg={"#101010"}
                border={"1px solid white"}
                color={"white"}
              >
                <AlertDialogHeader>Unfinish Ticket?</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  {selectedTicket ? (
                    <>
                      Are you sure that you want to mark{" "}
                      <Text as={"b"}>{selectedTicket.name}'s</Text> ticket as
                      unfinished??
                    </>
                  ) : (
                    "No ticket selected"
                  )}
                  <Textarea
                    mt={3}
                    placeholder="Please provide a reason on why the ticket is being unfinished..."
                  />
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} colorScheme="red">
                    No
                  </Button>
                  <Button
                    colorScheme="yellow"
                    ml={3}
                    onClick={() => {
                      handleUnfinish();
                    }}
                  >
                    Yes
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
