import React from 'react';
import HomeHeader from '../../components/HomeHeader';
import HomeFooter from '../../components/HomeFooter';
import BalanceSection from '../../components/BalanceSection';
import ModelCard from '../../components/ModelCard';
import './stake.css';

const models = [
  {
    modelName: 'Model 1',
    description: 'Description of model 1',
    poolCredit: 2356,
    totalStaked: 1957503396.88,
    apr: 7
  },
  {
    modelName: 'Model 2', 
    description: 'Description of model 2',
    poolCredit: 1234,
    totalStaked: 987654321.00,
    apr: 5
  },
  {
    modelName: 'Model 3',
    description: 'Description of model 3',
    poolCredit: 5678,
    totalStaked: 1234567890.00,
    apr: 8
  }
];

const StakePage = () => {
  return (
    <>
      <HomeHeader />
      <main className="pt-[80px] pb-[100px]">
        <div className="content-area flex gap-10">
          <div className="w-[250px]">
            <BalanceSection />
          </div>
          <div className="flex-1 space-y-10">
            {models.map((model, index) => (
              <ModelCard key={index} {...model} />
            ))}
          </div>
        </div>
      </main>
      <HomeFooter />
    </>
  );
};

export default StakePage;
