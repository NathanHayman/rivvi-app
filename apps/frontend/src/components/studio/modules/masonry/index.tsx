"use client";
import { Avatar, Card, Divider } from "@nextui-org/react";
import { BadgeCheck, Star } from "lucide-react";

function MasonryCard({ item }) {
  const { subtitle, name, image, title, body, stars, date } = item ?? {};
  return (
    <Card className="not-prose relative break-inside-avoid rounded-lg p-6 pb-4 lg:top-16">
      <div className="flex flex-col items-start truncate whitespace-pre-wrap">
        <div className="text-base font-bold tracking-tight lg:text-lg">
          {title}
        </div>
        <div className="mb-2 mt-4 text-[15px] text-gray-700">{body}</div>
      </div>
      <Divider className="my-4 w-full" />
      <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-center sm:space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="order-2 flex items-center space-x-2 lg:order-1">
          <Avatar radius="full" size="md" src={image} alt="Sebastian Mellen" />
          <div>
            <h4 className="flex items-center space-x-1 text-[15px] font-semibold text-gray-900">
              {name}
              <span className="flex items-center space-x-1">
                <span className="sr-only">Verified Customer Review</span>
                <BadgeCheck className="h-4 w-4 fill-[#3ba9ee55] text-[#3BA9EE]" />
              </span>
            </h4>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-sm text-gray-500 transition-all duration-75 hover:text-gray-900">
                {subtitle}
              </p>
              <p>·</p>
              <p className="mb-3 text-sm leading-3 text-gray-500 transition-all duration-75 hover:text-gray-900">
                {date}
              </p>
            </div>
          </div>
        </div>
        <div className="order-1 pb-4 lg:order-2 lg:self-end lg:pb-0">
          <div className="group flex items-center">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

const testData = [
  {
    id: 1,
    name: "John Doe",
    subtitle: "Las Vegas, NV",
    date: "5 hrs ago",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Excellent Product!",
    body: "I absolutely love this product. It exceeded my expectations and I highly recommend it.",
    stars: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    subtitle: "Las Vegas, NV",
    date: "5 hrs ago",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Good, but could be better",
    body: "The product is good overall, but it lacks some features that I would have liked. The product is good overall, but it lacks some features that I would have liked. It lacks some features that I would have liked.",
    stars: 3,
  },
  {
    id: 3,
    name: "Emily Johnson",
    subtitle: "Las Vegas, NV",
    date: "5 hrs ago",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Just okay",
    body: "It's an okay product. Does the job but nothing spectacular.",
    stars: 2,
  },
  {
    id: 4,
    name: "Michael Brown",
    subtitle: "Las Vegas, NV",
    date: "5 hrs ago",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Fantastic!",
    body: "This is the best product I've ever used. Highly recommend! The product is good overall, but it lacks some features that I would have liked.",
    stars: 5,
  },
  {
    id: 5,
    name: "Sarah Williams",
    subtitle: "Las Vegas, NV",
    date: "5 hrs ago",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Not worth the price",
    body: "I was disappointed with the product. It's not worth the high price tag.",
    stars: 1,
  },
];

export default function Masonry({ items = testData }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 sm:block sm:columns-2 sm:gap-6 xl:columns-3">
      {items.map((item) => {
        return (
          <div className="relative lg:top-16" key={item.id}>
            <MasonryCard item={item as any} />
          </div>
        );
      })}
    </div>
  );
}
