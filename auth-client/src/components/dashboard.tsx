const Dashboard = ({ data }: { data: string }) => {
  return (
    <div className="grid gap-4 place-content-center">
      <p>{data}</p>
    </div>
  );
};

export default Dashboard;
