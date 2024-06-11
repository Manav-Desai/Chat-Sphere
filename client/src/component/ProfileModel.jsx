import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({user,children}) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size={{base:'sm' , md:'lg'}} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='410px'>
          <ModalHeader
            fontSize={'32px'}
            fontFamily={'Poppins'}
            display={'flex'}
            justifyContent={'center'}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Image
              borderRadius={'full'}
              boxSize={'150px'}
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: '20px', md: "24px" }}
              fontFamily={'Poppins'}
            >Email : {user.email}</Text>
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal