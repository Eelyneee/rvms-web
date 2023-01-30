import React, { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import { Box, Link, Text, Flex, Heading, HStack, SimpleGrid, Divider } from "@chakra-ui/react";
import Head from "next/head";
import { supabaseClient } from "../lib/client";
import { getAdminstratorByID, getAllApprovedResident, getTodayVisitation, getAllVisitation, getPendingResidentRegistration } from "../lib/function-db"
import Header from "../components/Header";
import SideBarBox from "../components/SideBarBox";
import TodayVisitorTable from "../components/TodayVisitorTable";
import NewResidentTable from "../components/NewResidentTable";
import InfoCard from "../components/InfoCard";
import { FiBarChart, FiCalendar, FiFilePlus, FiUsers } from "react-icons/fi";
import { getTodayDate } from "../lib/function";
import MyMenu from "../components/Menu";

const Home = ({ session }) => {
  const router = useRouter();
  const adminID = supabaseClient.auth.user()?.id;
  const [adminData, setAdminData] = useState([]);
  const [residentAmount, setResidentAmount] = useState(0);
  const [registrationAmount, setRegistrationAmount] = useState(0);
  const [TodayVAmount, setTodayVAmount] = useState(0);
  const [TotalVAmount, setTotalVAmount] = useState(0);
  let date = getTodayDate();

  const loadAdmin = async () => {
    const { administrator, error } = await getAdminstratorByID(adminID);
    setAdminData(administrator);
  }

  const loadResident = async () => {
    const { residents, error } = await getAllApprovedResident();
    if (!error) {
      setResidentAmount(residents.length);
    }
  }

  const loadNewRegistration = async () => {
    const { residents_registration, error } = await getPendingResidentRegistration();
    if (!error) {
      setRegistrationAmount(residents_registration.length);
    }
  }

  const loadTodayV = async () => {
    const { visitation, error } = await getTodayVisitation(date);
    if (!error) {
      setTodayVAmount(visitation.length);
    }
  }

  const loadTotalV = async () => {
    const { visitation, error } = await getAllVisitation();
    if (!error) {
      setTotalVAmount(visitation.length);
    }
  }



  useEffect(() => {
    if (!supabaseClient.auth.user()) {
      router.push('/signin');
    } else {
      loadAdmin();
      loadResident();
      loadNewRegistration();
      loadTodayV();
      loadTotalV();
    }
  }, [session])

  return (
    <Box>
      <Header slug="Home" />
      <Box>
        <MyMenu />
        <SideBarBox /> <SideBarBox />
        <Flex>
          <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
          <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
            <Heading mb={4}>Overview</Heading>
            <SimpleGrid columns={[2, 4]} spacing={8} mb={8}>
              <InfoCard bgColor={'#FAF4FF'} color={'#6B36C1'} icon={FiFilePlus} amount={registrationAmount} title={"New residents"} />
              <InfoCard bgColor={'#EBEEFF'} color={'#2F49D1'} icon={FiBarChart} amount={residentAmount} title={"Total residents"} />
              <InfoCard bgColor={'#FFF2DE'} color={'#FFB648'} icon={FiUsers} amount={TodayVAmount} title={"Today visitors"} />
              <InfoCard bgColor={'#FFEFF4'} color={'#FF4079'} icon={FiCalendar} amount={TotalVAmount} title={"Total visitors"} />
            </SimpleGrid>
            <Heading mt={[4, 8, 16]} mb={4}>New Residents</Heading>
            <NewResidentTable />
            <Divider orientation='horizontal' color="#000" my="8" />
            <Heading mt={[4, 8, 16]}>Visitors</Heading>
            <Text fontSize="xs" mb={4}>(Today)</Text>
            <TodayVisitorTable />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;